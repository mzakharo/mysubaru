package com.subaru.global.infotainment.gen2.mirroring;

import com.subaru.global.infotainment.gen2.util.Param;

/* loaded from: classes.dex */
class CommandFactory {
    private CommandFactory() {
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static Command create(byte[] bArr) throws InvalidArgumentException {
        try {
            Param parse = Param.parse(new String(bArr));
            String string = parse.getString("cmd");
            if ("mirroring".equals(string)) {
                return MirroringCommand.create(parse);
            }
            if ("status".equals(string)) {
                return StatusCommand.create();
            }
            if ("clear".equals(string)) {
                return ClearCommand.create();
            }
            throw new InvalidArgumentException("Invalid cmd value");
        } catch (Param.ParamException unused) {
            throw new InvalidArgumentException();
        }
    }
}
