package exercisesdb.common;

//import com.itextpdf.html2pdf.HtmlConverter;
import com.alva.papergen.sdk.PaperGenClient;
import exercisesdb.model.MyPaper;
import exercisesdb.types.MyPaperStructs;

import java.io.*;

public class MyPaperStructCommon {

    public static MyPaperStructs getMyPaperStruct(Long paperId) {
        MyPaper myPaper = MyPaper.dao.findById(1);
        MyPaperStructs myPaperStructs = new MyPaperStructs(myPaper);
        return myPaperStructs;
    }

    public static boolean download(Long paperID, String path) {
        boolean result = false;
        //ADD By Andy
        PaperGenClient genClient = new PaperGenClient();
        try {
            genClient.connect(GetPathCommon.getPSAddr(), GetPathCommon.getPSPort());
            genClient.generator(paperID,path);
            genClient.close();
            result = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    private static File getInputStreamByPaperId(Long paperID, String contentType) {
        File result = null;
        switch (contentType) {
            case "paper":
                String fileName = paperID.toString() + contentType;
                if (fileName.equals("html-file-name.html")) {
                    result = new File("html-file-name.html");
                } else {
                    result = new File("html-file-name.html");
                }
                break;
            case "answer":
                // @@ for test
                result = new File("html-file-name.html");
                break;
            default:
                break;
        }
        // @@ end of test
        return result;
    }
}
