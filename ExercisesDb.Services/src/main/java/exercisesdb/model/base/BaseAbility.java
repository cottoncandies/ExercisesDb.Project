package exercisesdb.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseAbility<M extends BaseAbility<M>> extends Model<M> implements IBean {

	public M setId(Long ngId) {
		set("ng_id", ngId);
		return (M)this;
	}
	
	public Long getId() {
		return getLong("ng_id");
	}

	public M setSection(Integer ntSection) {
		set("nt_section", ntSection);
		return (M)this;
	}
	
	public Integer getSection() {
		return getInt("nt_section");
	}

	public M setSubjectId(Long ngSubjectId) {
		set("ng_subject_id", ngSubjectId);
		return (M)this;
	}
	
	public Long getSubjectId() {
		return getLong("ng_subject_id");
	}

	public M setCaption(String szCaption) {
		set("sz_caption", szCaption);
		return (M)this;
	}
	
	public String getCaption() {
		return getStr("sz_caption");
	}

	public M setState(Integer ntState) {
		set("nt_state", ntState);
		return (M)this;
	}
	
	public Integer getState() {
		return getInt("nt_state");
	}

	public M setComment(String txComment) {
		set("tx_comment", txComment);
		return (M)this;
	}
	
	public String getComment() {
		return getStr("tx_comment");
	}

	public M setOldId(Integer ntOldId) {
		set("nt_old_id", ntOldId);
		return (M)this;
	}
	
	public Integer getOldId() {
		return getInt("nt_old_id");
	}

}
