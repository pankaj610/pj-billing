import { useController } from "react-hook-form";
import { KeyboardType } from "react-native";
import { TextInput } from "react-native-paper";
import { LogicProps } from "react-native-paper-form-builder/dist/Types/Types";

function CustomInput(props: LogicProps & { keyboardType: KeyboardType }) {
    const { name, rules, shouldUnregister, defaultValue, control, keyboardType } = props;
    const { field } = useController({
        name,
        rules,
        shouldUnregister,
        defaultValue,
        control,
    });

    return (
        <TextInput
            value={field.value}
            keyboardType={keyboardType}
            mode='outlined'
            label={props.textInputProps.label.toString()}
            onChangeText={field.onChange}
            placeholder={props.textInputProps.label.toString()}
            left={props.textInputProps.left}
        />
    );
}

export default CustomInput
