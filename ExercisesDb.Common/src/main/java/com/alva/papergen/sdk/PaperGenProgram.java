/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.alva.papergen.sdk;

import java.io.File;
import java.io.IOException;

/**
 *
 * @author andy
 */
public class PaperGenProgram {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        System.out.println("Start...");
        PaperGenClient genClient = new PaperGenClient();
        genClient.connect("127.0.0.1", 6031);
        genClient.generator(454473038196225L,"d:/aaa.pdf");
        System.out.println(genClient.getMessage());              
        
        genClient.close();
        System.out.println("End!");
    }
    
}
