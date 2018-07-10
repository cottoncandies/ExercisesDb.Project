package exercisesdb.services;

import exercisesdb.model.Ability;

import java.util.List;

public class AbilityService {

    public static List<Ability> getAbility(int section, Long subjectId) {
        String sql = "select ng_id,nt_section,ng_subject_id,sz_caption,nt_state,tx_comment,nt_old_id from sys_ability_t" +
                " where nt_section = ? and ng_subject_id = ?";
        List<Ability> abilities = Ability.dao.find(sql, section, subjectId);
        return (null != abilities && abilities.size() > 0) ? abilities : null;
    }

}
