package com.alva.papergen.sdk;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.Socket;

/**
 *
 * @author andy
 */
public class PaperGenClient {

    private Socket clientSocket = null;
    private final int BUF_LEN = 8192;
    private String message;

    public String getMessage() {
        return message;
    }

    public void connect(String addr, int port) throws IOException {
        clientSocket = new Socket(addr, port);        
    }
   

    public boolean generator(long id, String fileFullName) throws FileNotFoundException, IOException {
        if (null == fileFullName || "".equals(fileFullName)) {
            return false;
        }

        int kind = fileFullName.lastIndexOf(".");
        if(kind<=0) {
        	return false;
        }
        String fileEx = fileFullName.substring(kind);
        fileEx = fileEx.toLowerCase();
        if (".pdf".equals(fileEx)) {
        	kind = 1;
        }else if (".doc".equals(fileEx)) {
        	kind = 2;
        }else if (".docx".equals(fileEx)) {
        	kind = 3;
        }else if (".epub".equals(fileEx)) {
        	kind = 4;
        }else {
        	kind = 3;
        }       
        
        sendFile(id, kind);
        return receiveFile(fileFullName);
    }
    
    private void sendFile(long id,int kind) throws IOException, UnsupportedEncodingException, FileNotFoundException {

        OutputStream cos = clientSocket.getOutputStream();
        DataOutputStream dos = new DataOutputStream(cos);
        dos.writeInt(kind);
    	dos.writeLong(id);        
    }

    private boolean receiveFile(String destFile) throws IOException {
        long readTotal = 0;
        long datalen = 0;
        int leftCount = 0;
        byte[] buffer = new byte[BUF_LEN];
        InputStream cis = clientSocket.getInputStream();
        DataInputStream dis = new DataInputStream(cis);

        int result = dis.readInt();
        if (200 == result) {        	
            OutputStream fos = new FileOutputStream(destFile);
            try {
                datalen = dis.readLong();
                readTotal = 0;
                leftCount = datalen - readTotal > BUF_LEN ? BUF_LEN : (int) (datalen - readTotal);
                while (leftCount > 0) {
                    leftCount = cis.read(buffer, 0, leftCount);
                    fos.write(buffer, 0, leftCount);
                    readTotal += leftCount;
                    leftCount = datalen - readTotal > BUF_LEN ? BUF_LEN : (int) (datalen - readTotal);
                }
                message = "OK";
            } finally {
                fos.close();
            }
            return false;
        } else {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try {
                datalen = dis.readInt();
                readTotal = 0;
                leftCount = datalen - readTotal > BUF_LEN ? BUF_LEN : (int) (datalen - readTotal);
                while (leftCount > 0) {
                    leftCount = cis.read(buffer, 0, leftCount);
                    baos.write(buffer, 0, leftCount);
                    readTotal += leftCount;
                    leftCount = datalen - readTotal > BUF_LEN ? BUF_LEN : (int) (datalen - readTotal);
                }
                message = new String(baos.toByteArray(), "utf-8");
            } finally {
                baos.close();
            }
            return false;
        }
    }

    

    public void close() throws IOException {
        if (null != clientSocket) {
            clientSocket.close();
        }
    }
}
