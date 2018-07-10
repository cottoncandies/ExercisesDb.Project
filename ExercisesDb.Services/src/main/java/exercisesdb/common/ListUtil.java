package exercisesdb.common;

import java.util.HashSet;
import java.util.List;

public class ListUtil {
    public static void removeDuplicate(List list) {
        HashSet h = new HashSet(list);
        list.clear();
        list.addAll(h);
    }
}
