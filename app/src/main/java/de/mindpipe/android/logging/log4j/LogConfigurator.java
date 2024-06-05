package de.mindpipe.android.logging.log4j;

import java.io.IOException;
import org.apache.log4j.Level;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;
import org.apache.log4j.RollingFileAppender;
import org.apache.log4j.helpers.LogLog;

/* loaded from: classes.dex */
public class LogConfigurator {
    private String fileName;
    private String filePattern;
    private boolean immediateFlush;
    private boolean internalDebugging;
    private String logCatPattern;
    private int maxBackupSize;
    private long maxFileSize;
    private boolean resetConfiguration;
    private Level rootLevel;
    private boolean useFileAppender;
    private boolean useLogCatAppender;

    public LogConfigurator() {
        this.rootLevel = Level.DEBUG;
        this.filePattern = "%d - [%p::%c::%C] - %m%n";
        this.logCatPattern = "%m%n";
        this.fileName = "android-log4j.log";
        this.maxBackupSize = 5;
        this.maxFileSize = 524288L;
        this.immediateFlush = true;
        this.useLogCatAppender = true;
        this.useFileAppender = true;
        this.resetConfiguration = true;
        this.internalDebugging = false;
    }

    public LogConfigurator(String str) {
        this.rootLevel = Level.DEBUG;
        this.filePattern = "%d - [%p::%c::%C] - %m%n";
        this.logCatPattern = "%m%n";
        this.fileName = "android-log4j.log";
        this.maxBackupSize = 5;
        this.maxFileSize = 524288L;
        this.immediateFlush = true;
        this.useLogCatAppender = true;
        this.useFileAppender = true;
        this.resetConfiguration = true;
        this.internalDebugging = false;
        setFileName(str);
    }

    public LogConfigurator(String str, Level level) {
        this(str);
        setRootLevel(level);
    }

    public LogConfigurator(String str, Level level, String str2) {
        this(str);
        setRootLevel(level);
        setFilePattern(str2);
    }

    public LogConfigurator(String str, int i, long j, String str2, Level level) {
        this(str, level, str2);
        setMaxBackupSize(i);
        setMaxFileSize(j);
    }

    public void configure() {
        Logger rootLogger = Logger.getRootLogger();
        if (isResetConfiguration()) {
            LogManager.getLoggerRepository().resetConfiguration();
        }
        LogLog.setInternalDebugging(isInternalDebugging());
        if (isUseFileAppender()) {
            configureFileAppender();
        }
        if (isUseLogCatAppender()) {
            configureLogCatAppender();
        }
        rootLogger.setLevel(getRootLevel());
    }

    public void setLevel(String str, Level level) {
        Logger.getLogger(str).setLevel(level);
    }

    private void configureFileAppender() {
        Logger rootLogger = Logger.getRootLogger();
        try {
            RollingFileAppender rollingFileAppender = new RollingFileAppender(new PatternLayout(getFilePattern()), getFileName());
            rollingFileAppender.setMaxBackupIndex(getMaxBackupSize());
            rollingFileAppender.setMaximumFileSize(getMaxFileSize());
            rollingFileAppender.setImmediateFlush(isImmediateFlush());
            rootLogger.addAppender(rollingFileAppender);
        } catch (IOException e) {
            throw new RuntimeException("Exception configuring log system", e);
        }
    }

    private void configureLogCatAppender() {
        Logger.getRootLogger().addAppender(new LogCatAppender(new PatternLayout(getLogCatPattern())));
    }

    public Level getRootLevel() {
        return this.rootLevel;
    }

    public void setRootLevel(Level level) {
        this.rootLevel = level;
    }

    public String getFilePattern() {
        return this.filePattern;
    }

    public void setFilePattern(String str) {
        this.filePattern = str;
    }

    public String getLogCatPattern() {
        return this.logCatPattern;
    }

    public void setLogCatPattern(String str) {
        this.logCatPattern = str;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileName(String str) {
        this.fileName = str;
    }

    public int getMaxBackupSize() {
        return this.maxBackupSize;
    }

    public void setMaxBackupSize(int i) {
        this.maxBackupSize = i;
    }

    public long getMaxFileSize() {
        return this.maxFileSize;
    }

    public void setMaxFileSize(long j) {
        this.maxFileSize = j;
    }

    public boolean isImmediateFlush() {
        return this.immediateFlush;
    }

    public void setImmediateFlush(boolean z) {
        this.immediateFlush = z;
    }

    public boolean isUseFileAppender() {
        return this.useFileAppender;
    }

    public void setUseFileAppender(boolean z) {
        this.useFileAppender = z;
    }

    public boolean isUseLogCatAppender() {
        return this.useLogCatAppender;
    }

    public void setUseLogCatAppender(boolean z) {
        this.useLogCatAppender = z;
    }

    public void setResetConfiguration(boolean z) {
        this.resetConfiguration = z;
    }

    public boolean isResetConfiguration() {
        return this.resetConfiguration;
    }

    public void setInternalDebugging(boolean z) {
        this.internalDebugging = z;
    }

    public boolean isInternalDebugging() {
        return this.internalDebugging;
    }
}
