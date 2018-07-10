package exercisesdb.controller;

import exercisesdb.model.Subject;
import exercisesdb.model.User;
import exercisesdb.services.*;
import exercisesdb.types.SessionalUser;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import static exercisesdb.common.Const.*;

public class LoginController extends BaseController {

    public void exams() throws UnsupportedEncodingException {
        int result = checkUserLogin();
        String userName = getPara("username");
        String nickName = getPara("nickname");
        String nickNameEncode = URLEncoder.encode(nickName ,"utf-8");
//        String nickName = URLDecoder.decode(getPara("nickname"), "UTF-8");
        switch (result) {
            case SUNULL:
                redirect("/error.html");
                break;
            case UNULL:
//                String url = "/banben.html?isCollect=0&type=zsd&from=0&username=" + userName;
//                String url = URLEncoder.encode("/banben.html?isCollect=0&type=zsd&from=0&username=" + userName +"&nickname="+nickName,"utf-8");
                String url = "/banben.html?isCollect=0&type=zsd&from=0&username=" + userName +"&nickname="+nickNameEncode;
                redirect(url);
                break;
            case SUCCESS:
                redirect("/knowledge.html?username=" + userName+"&nickname="+nickNameEncode);
                break;
        }
    }

    public void myExams() throws UnsupportedEncodingException {
        int result = checkUserLogin();
        String userName = getPara("username");
        String nickName = getPara("nickname");
        String nickNameEncode = URLEncoder.encode(nickName ,"utf-8");
//        String nickName = URLDecoder.decode(getPara("nickname"), "UTF-8");
        switch (result) {
            case SUNULL:
                redirect("/error.html");
                break;
            case UNULL:
//                String url = "/banben.html?isCollect=0&type=zsd&from=0&username=" + userName;
//                String url = URLEncoder.encode("/banben.html?isCollect=0&type=zsd&from=0&username=" + userName +"&nickname="+nickName , "utf-8");
                String url = "/banben.html?isCollect=0&type=zsd&from=0&username=" + userName +"&nickname="+nickNameEncode ;
                redirect(url);
                break;
            case SUCCESS:
                redirect("/myCollectKnowledge.html?username=" + userName+"&nickname="+nickNameEncode);
                break;
        }
    }

    public void myPapers()throws UnsupportedEncodingException {
        int result = checkUserLogin();
        String userName = getPara("username");
        String nickName = getPara("nickname");
        String nickNameEncode = URLEncoder.encode(nickName ,"utf-8");
//        String nickName = URLDecoder.decode(getPara("nickname"), "UTF-8");
        switch (result) {
            case SUNULL:
                redirect("/error.html");
                break;
            case UNULL:
//                String url = "/banben.html?isCollect=0&type=paperList&from=0&username=" + userName;
//                String url = URLEncoder.encode("/banben.html?isCollect=0&type=paperList&from=0&username=" + userName + "&nickname=" + nickName ,"utf-8");
                String url = "/banben.html?isCollect=0&type=paperList&from=0&username=" + userName + "&nickname=" + nickNameEncode ;
                redirect(url);
                break;
            case SUCCESS:
                redirect("/myPaperList.html?username=" + userName+"&nickname=" + nickNameEncode);
                break;
        }
    }

    public void setExamVersion() throws UnsupportedEncodingException {
        int isCollect = getParaToInt("isCollect");
        int section = getParaToInt("section");
        String subject = getPara("subject");
        String type = getPara("type");
        String userName = getPara("name");
        String nickName = getPara("nickname");
        String nickNameEncode = URLEncoder.encode(nickName ,"utf-8");
//        String nickNameEncode = URLDecoder.decode(getPara("nickname"), "UTF-8");
        int sectionCode = getParaToInt("last");
        SessionalUser su = getSessionalUser();
        if (null == su) {
            su = new SessionalUser();
//            User user = UserService.addUser(userName, section, subject);
            User user = UserService.addUser(userName, section, subject , nickName);
            su.setId(user.getId());
            su.setUserName(user.getUsername());
            su.setNickName(user.getNickname());
        } else {
            if (userName.equals(su.getUserName())) {
//                UserService.updateSectionSubject(su.getUserName(), section, subject);
                UserService.updateSectionSubject(su.getUserName(), section, subject , nickName);
            } else {
                su = new SessionalUser();
//                User user = UserService.addUser(userName, section, subject);
                User user = UserService.addUser(userName, section, subject , nickName);
                su.setId(user.getId());
                su.setNickName(user.getNickname());
                su.setUserName(user.getUsername());
            }
        }

        su.setSection(section);
        su.setSubject(subject);
        Subject sub = SubjectService.getSubjectByCaption(subject);
        su.setSubjectId(sub.getId());
        su.setMyPaperStructs(MyPaperStructsService.getMyPaper(su.getId(), sub.getId(), section));
        su.setAllKnowPoint(KnowPointService.getKnowPoints(section, sub.getId()));
        su.setAbilities(AbilityService.getAbility(section, sub.getId()));
        su.setAllExamKind(ExamKindService.getExamKinds(section, sub.getId()));
        su.setFavorites(FavoriteService.getFav(su.getId(), section, sub.getId()));
        setSessionalUser(su);
        if (isCollect == 0) {
            switch (type) {
                case "zsd":
                    redirect("/knowledge.html?username=" + userName);
                    break;
                case "chapter":
                    redirect("/chapter.html?username=" + userName);
                    break;
                case "paper":
                    if (sectionCode > 1 && section == 1) {
                        redirect("/knowledge.html?username=" + userName);
                    } else {
                        redirect("/aPaper.html?username=" + userName);
                    }
                    break;
                case "paperList":
                    redirect("/myPaperList.html?username=" + userName);
                    break;
            }
        } else {
            switch (type) {
                case "zsd":
                    redirect("/myCollectKnowledge.html?username=" + userName);
                    break;
                case "chapter":
                    redirect("/myCollect.html?username=" + userName);
                    break;
                case "paper":
                    if (sectionCode > 1 && section == 1) {
                        redirect("/myCollectKnowledge.html?username=" + userName);
                    } else {
                        redirect("/myCollectAPaper.html?username=" + userName);
                    }
                    break;
            }
        }
    }
}
