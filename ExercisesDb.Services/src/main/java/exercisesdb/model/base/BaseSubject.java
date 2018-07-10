package exercisesdb.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseSubject<M extends BaseSubject<M>> extends Model<M> implements IBean {

	public M setId(Long ngId) {
		set("ng_id", ngId);
		return (M)this;
	}
	
	public Long getId() {
		return getLong("ng_id");
	}

	public M setCaption(String szCaption) {
		set("sz_caption", szCaption);
		return (M)this;
	}
	
	public String getCaption() {
		return getStr("sz_caption");
	}

	public M setSections(String szSections) {
		set("sz_sections", szSections);
		return (M)this;
	}
	
	public String getSections() {
		return getStr("sz_sections");
	}

}