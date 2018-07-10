package exercisesdb.common;

import java.io.File;

public class FileUtil {

    public static boolean deleteMyPaperDocument(String filePath) {
        File file = new File(filePath);
        if (file.exists()) {
            return file.delete();
        } else {
            return false;
        }
    }

}
