package com.uievolution.microserver.websocket;

import com.uievolution.microserver.MicroServer;
import java.nio.BufferUnderflowException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CodingErrorAction;

/* JADX INFO: Access modifiers changed from: package-private */
/* loaded from: classes.dex */
public class d {
    private ByteBuffer a;
    private c b;

    static int a(byte b) {
        int i = b & 255;
        if (((i >>> 7) & 1) == 0) {
            return 1;
        }
        if ((i >>> 5) == 6) {
            return 2;
        }
        if ((i >>> 4) == 14) {
            return 3;
        }
        if ((i >>> 3) == 30) {
            return 4;
        }
        if ((i >>> 2) == 62) {
            return 5;
        }
        if ((i >>> 1) == 126) {
            return 6;
        }
        return (i >>> 6) == 2 ? 0 : -1;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static String b(ByteBuffer byteBuffer) throws ProtocolException {
        if (byteBuffer.remaining() == 0) {
            return "";
        }
        CharsetDecoder newDecoder = Charset.forName("UTF-8").newDecoder();
        newDecoder.onMalformedInput(CodingErrorAction.REPORT);
        newDecoder.onUnmappableCharacter(CodingErrorAction.REPORT);
        try {
            String charBuffer = newDecoder.decode(byteBuffer).toString();
            byteBuffer.rewind();
            boolean z = true;
            int limit = byteBuffer.limit() - 1;
            int i = 0;
            while (true) {
                if (limit < 0 || i > 6) {
                    break;
                }
                int a = a(byteBuffer.get(limit));
                if (1 > a || a > 6) {
                    if (a != 0) {
                        break;
                    }
                    i++;
                    limit--;
                } else if (a == i + 1) {
                }
            }
            z = false;
            if (z) {
                return charBuffer;
            }
            throw new ProtocolException(1007);
        } catch (Exception unused) {
            throw new ProtocolException(1007);
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public c a() throws ProtocolException {
        ByteBuffer byteBuffer = this.a;
        c cVar = null;
        if (byteBuffer == null) {
            return null;
        }
        try {
            byte b = byteBuffer.get();
            int i = (b & 128) >> 7;
            int i2 = (b & 64) >> 6;
            int i3 = (b & 32) >> 5;
            int i4 = (b & 16) >> 4;
            if (i2 == 0 && i3 == 0 && i4 == 0) {
                int i5 = b & 15;
                byte b2 = this.a.get();
                if (((b2 & 128) >> 7) != 0) {
                    int i6 = b2 & Byte.MAX_VALUE;
                    if (i6 == 126) {
                        byte[] bArr = new byte[2];
                        this.a.get(bArr);
                        i6 = ((bArr[0] & 255) << 8) | (bArr[1] & 255);
                    } else if (i6 == 127) {
                        long j = this.a.getLong();
                        if (2147483647L < j) {
                            MicroServer.Logger.w("ws.Decoder", "cannot handle too large payload: " + j);
                            throw new ProtocolException(1002, "too large payload," + j);
                        }
                        i6 = (int) j;
                    }
                    byte[] bArr2 = new byte[4];
                    this.a.get(bArr2);
                    byte[] bArr3 = new byte[i6];
                    this.a.get(bArr3);
                    for (int i7 = 0; i7 < i6; i7++) {
                        bArr3[i7] = (byte) (bArr3[i7] ^ bArr2[i7 % 4]);
                    }
                    if (Opcode.isControlFrame(i5)) {
                        if (i6 > 125) {
                            MicroServer.Logger.w("ws.Decoder", "Payload in control frame must be less than 125");
                            throw new ProtocolException(1002);
                        }
                        if (i != 0) {
                            cVar = c.a(i5, i);
                            cVar.a(bArr3);
                        } else {
                            MicroServer.Logger.w("ws.Decoder", "FIN in control frame must be 1");
                            throw new ProtocolException(1002);
                        }
                    } else if (i != 1 || i5 == 0) {
                        if (i != 0 || i5 == 0) {
                            if (i == 0 && i5 == 0) {
                                c cVar2 = this.b;
                                if (cVar2 != null && !cVar2.c()) {
                                    this.b.a(bArr3);
                                    cVar = this.b;
                                } else {
                                    throw new ProtocolException(1002);
                                }
                            } else if (i == 1 && i5 == 0) {
                                c cVar3 = this.b;
                                if (cVar3 != null && !cVar3.c()) {
                                    this.b.a(bArr3);
                                    this.b.e();
                                    c cVar4 = this.b;
                                    this.b = null;
                                    cVar = cVar4;
                                } else {
                                    throw new ProtocolException(1002);
                                }
                            }
                        } else if (this.b == null) {
                            cVar = c.a(i5, i);
                            this.b = cVar;
                            cVar.a(bArr3);
                        } else {
                            throw new ProtocolException(1002);
                        }
                    } else if (this.b == null) {
                        cVar = c.a(i5, i);
                        cVar.a(bArr3);
                    } else {
                        throw new ProtocolException(1002);
                    }
                    b();
                    return cVar;
                }
                MicroServer.Logger.w("ws.Decoder", "Client should always mask the payload data");
                throw new ProtocolException(1002, "not masked");
            }
            MicroServer.Logger.w("ws.Decoder", "Some of rsv are not 0. " + i2 + ", " + i3 + ", " + i4);
            throw new ProtocolException(1002, "RSV is not 0");
        } catch (BufferUnderflowException unused) {
            this.a.rewind();
            return null;
        }
    }

    private void b() {
        if (!this.a.hasRemaining()) {
            this.a = null;
            return;
        }
        ByteBuffer allocate = ByteBuffer.allocate(this.a.remaining());
        allocate.put(this.a);
        this.a = allocate;
        allocate.flip();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void a(ByteBuffer byteBuffer) {
        ByteBuffer byteBuffer2 = this.a;
        if (byteBuffer2 != null && byteBuffer2.hasRemaining()) {
            ByteBuffer allocate = ByteBuffer.allocate(this.a.remaining() + byteBuffer.remaining());
            allocate.put(this.a);
            allocate.put(byteBuffer);
            allocate.flip();
            this.a = allocate;
            return;
        }
        this.a = byteBuffer;
    }
}
