package exercisesdb.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseExamAbi<M extends BaseExamAbi<M>> extends Model<M> implements IBean {

	public M setId(Long ngId) {
		set("ng_id", ngId);
		return (M)this;
	}
	
	public Long getId() {
		return getLong("ng_id");
	}

	public M setExamId(Long ngExamId) {
		set("ng_exam_id", ngExamId);
		return (M)this;
	}
	
	public Long getExamId() {
		return getLong("ng_exam_id");
	}

	public M setAbiId(Long ngAbiId) {
		set("ng_abi_id", ngAbiId);
		return (M)this;
	}
	
	public Long getAbiId() {
		return getLong("ng_abi_id");
	}

}
