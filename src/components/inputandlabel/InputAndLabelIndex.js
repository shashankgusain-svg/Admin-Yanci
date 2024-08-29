import CustomLabel from "./CustomLabel";
import CustomInput from "./CustomInput";
import InputAndLabel from "./InputAndLabel";
import CustomSelect from "./CustomSelect";
import CustomOption from "./CustomOption";
import CustomTextArea from "./CustomTextArea";

InputAndLabel.Label = CustomLabel;
InputAndLabel.Input = CustomInput;
InputAndLabel.Select = CustomSelect;
InputAndLabel.Option = CustomOption;
InputAndLabel.TextArea = CustomTextArea;

export default InputAndLabel;