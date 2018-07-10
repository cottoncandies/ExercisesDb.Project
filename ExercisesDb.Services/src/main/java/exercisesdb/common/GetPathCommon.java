package exercisesdb.common;

import com.jfinal.kit.PropKit;

import java.io.File;

public class GetPathCommon {
    private static String downloadPath = null;
    private static String resourceUrl = null;
    private static String PSAddr;
    private static int PSPort = 0;

    //得到配置文件中 保存文件的路径
    public static String getDownloadPath() {
        return downloadPath;
    }

    public static String getResourceUrl() {
        return resourceUrl;
    }

    public static String getPSAddr() {
        return PSAddr;
    }

    public static int getPSPort() {
        return PSPort;
    }

    static {
        PropKit.use("config.properties");
        downloadPath = PropKit.get("path");
        resourceUrl = PropKit.get("resourceUrl");
        PSAddr = PropKit.get("PSAddr");
        PSPort = Integer.parseInt(PropKit.get("PSPort"));
    }
}
