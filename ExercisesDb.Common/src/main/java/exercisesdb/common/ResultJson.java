package exercisesdb.common;

import com.alibaba.fastjson.JSONObject;

public class ResultJson {
    private static Integer resultState = 0;
    private static String reason = "请求成功";
    private static String data = "";

    public static JSONObject getResultJson(){
        JSONObject result = new JSONObject();
        result.put("result",resultState);
        result.put("reason",reason);
        result.put("data",data);
        return result;
    }
}
