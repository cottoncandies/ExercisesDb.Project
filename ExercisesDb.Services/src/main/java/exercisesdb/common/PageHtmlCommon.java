package exercisesdb.common;

public class PageHtmlCommon {
    public static String getPageHtml(double pageAllCount,int pageNum){
        //定义Html
        String strPageHTML="<ul class='pagelist'>";
        if(pageAllCount>0){
            //上一页
            if(pageNum!=1){
                strPageHTML+="<li><a href='javascript:stPaging("+(pageNum-1)+")'> &lt; </a></li>&#32;";
            }
            //选中页前大于两个页码  显示首页
            if(pageNum-1>2){
                strPageHTML+="<li><a href='javascript:stPaging(1)'>1...</a></li>";
            }
            //中间页码
            for(int i=1;i<=pageAllCount;i++){
                //选中页的前后两个页码
                if(i+1==pageNum||i+2==pageNum||i==pageNum+1||i==pageNum+2){
                    strPageHTML +="<li><a href='javascript:stPaging("+i+")'>"+i+"</a></li>";
                }
                //选中页
                if(pageNum==i){
                    strPageHTML +="<li class='thisclass'><a>"+i+"</a></li>";
                }
            }
            //选中页后大于两个页码 显示尾页
            if(pageNum+2<pageAllCount){
                strPageHTML+="<li><a href='javascript:stPaging("+(int)pageAllCount+")'>"+(int)pageAllCount+"...</a></li>";
            }
            //下一页
            if(pageAllCount>=2&&pageNum!=pageAllCount){
                strPageHTML+="<li><a href='javascript:stPaging("+(pageNum+1)+")'> &gt; </a></li>";
            }

        }else{
            strPageHTML+="<strong style='color: Red'>暂时没有找到您需要的数据</strong>";
        }
        strPageHTML+="</ul>";
        return strPageHTML ;
    }
}
