package com.uievolution.microserver.http;

import com.uievolution.microserver.MicroServer;
import org.apache.log4j.varia.ExternallyRolledFileAppender;

/* loaded from: classes.dex */
public class EnglishReasonPhraseCatalog {
    private EnglishReasonPhraseCatalog() {
    }

    public static String getReason(int i) {
        if (i == 307) {
            return "Temporary Redirect";
        }
        switch (i) {
            case 100:
                return "Continue";
            case 101:
                return "Switching Protocols";
            case 102:
                return "Processing";
            default:
                switch (i) {
                    case 200:
                        return ExternallyRolledFileAppender.OK;
                    case HttpStatus.SC_CREATED /* 201 */:
                        return "Created";
                    case HttpStatus.SC_ACCEPTED /* 202 */:
                        return "Accepted";
                    case HttpStatus.SC_NON_AUTHORITATIVE_INFORMATION /* 203 */:
                        return "Non-Authoritative Information";
                    case HttpStatus.SC_NO_CONTENT /* 204 */:
                        return "No Content";
                    case HttpStatus.SC_RESET_CONTENT /* 205 */:
                        return "Reset Content";
                    case HttpStatus.SC_PARTIAL_CONTENT /* 206 */:
                        return "Partial Content";
                    case HttpStatus.SC_MULTI_STATUS /* 207 */:
                        return "Multi-Status";
                    default:
                        switch (i) {
                            case 300:
                                return "Multiple Choices";
                            case HttpStatus.SC_MOVED_PERMANENTLY /* 301 */:
                                return "Moved Permanently";
                            case HttpStatus.SC_MOVED_TEMPORARILY /* 302 */:
                                return "Moved Temporarily";
                            case HttpStatus.SC_SEE_OTHER /* 303 */:
                                return "See Other";
                            case HttpStatus.SC_NOT_MODIFIED /* 304 */:
                                return "Not Modified";
                            case HttpStatus.SC_USE_PROXY /* 305 */:
                                return "Use Proxy";
                            default:
                                switch (i) {
                                    case 400:
                                        return "Bad Request";
                                    case HttpStatus.SC_UNAUTHORIZED /* 401 */:
                                        return "Unauthorized";
                                    case HttpStatus.SC_PAYMENT_REQUIRED /* 402 */:
                                        return "Payment Required";
                                    case HttpStatus.SC_FORBIDDEN /* 403 */:
                                        return "Forbidden";
                                    case HttpStatus.SC_NOT_FOUND /* 404 */:
                                        return "Not Found";
                                    case HttpStatus.SC_METHOD_NOT_ALLOWED /* 405 */:
                                        return "Method Not Allowed";
                                    case HttpStatus.SC_NOT_ACCEPTABLE /* 406 */:
                                        return "Not Acceptable";
                                    case HttpStatus.SC_PROXY_AUTHENTICATION_REQUIRED /* 407 */:
                                        return "Proxy Authentication Required";
                                    case HttpStatus.SC_REQUEST_TIMEOUT /* 408 */:
                                        return "Request Timeout";
                                    case HttpStatus.SC_CONFLICT /* 409 */:
                                        return "Conflict";
                                    case HttpStatus.SC_GONE /* 410 */:
                                        return "Gone";
                                    case HttpStatus.SC_LENGTH_REQUIRED /* 411 */:
                                        return "Length Required";
                                    case HttpStatus.SC_PRECONDITION_FAILED /* 412 */:
                                        return "Precondition Failed";
                                    case HttpStatus.SC_REQUEST_TOO_LONG /* 413 */:
                                        return "Request Entity Too Large";
                                    case HttpStatus.SC_REQUEST_URI_TOO_LONG /* 414 */:
                                        return "Request-URI Too Long";
                                    case HttpStatus.SC_UNSUPPORTED_MEDIA_TYPE /* 415 */:
                                        return "Unsupported Media Type";
                                    case HttpStatus.SC_REQUESTED_RANGE_NOT_SATISFIABLE /* 416 */:
                                        return "Requested Range Not Satisfiable";
                                    case HttpStatus.SC_EXPECTATION_FAILED /* 417 */:
                                        return "Expectation Failed";
                                    default:
                                        switch (i) {
                                            case 500:
                                                return "Internal Server Error";
                                            case 501:
                                                return "Not Implemented";
                                            case 502:
                                                return "Bad Gateway";
                                            case 503:
                                                return "Service Unavailable";
                                            case 504:
                                                return "Gateway Timeout";
                                            case HttpStatus.SC_HTTP_VERSION_NOT_SUPPORTED /* 505 */:
                                                return "HTTP Version Not Supported";
                                            default:
                                                MicroServer.Logger.w("PhraseCatlog", "Unsupported status code:" + i);
                                                return "Unsupported status code:" + i;
                                        }
                                }
                        }
                }
        }
    }
}
