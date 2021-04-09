import {useState} from 'react';
import * as Yup from 'yup';

export default function useYupValidation(formInitState, schemaObject) {
    const [formState, setLogin] = useState(formInitState);
    const [errors, setErrors] = useState(formInitState)

    const validationSchema = Yup.object().shape(schemaObject);

    const validateField = (feildName, feildValue) => {
        let error = {};
        error[feildName] = "";//reseting
        try {
            validationSchema.validateSync({[feildName]:feildValue});
        } catch (e) {
            error[feildName] = e.type === "typeError" ?  `${feildName} must be a valid type (type error)`: e.errors[0];
        }
        return error;
    }
    const validateAllFields = (dataObject) =>{
            let errors = {};
            for (const key in dataObject) {
                errors = {...errors, ...validateField(key, dataObject[key])}
            }
            return errors;
    };
    const hasAnyError = (response) => {
        let hasError = false;
        for (const key in response) {
            if(response[key].length > 0){
                hasError = true;
                break;
            }//end if
        }//end for
        return hasError;
    }
    const handleOnError = (name, value) => {
		const newError = validateField(name, value);
		setErrors({
			...errors,
			...newError
		});
	}
    const handleChange = (e) => {
		const { name, value } = e.target;
		handleOnError(name, value);

		setLogin((prevState) => ({
			...prevState,
			[name]: value
		}));
	};
    const isFormInValid = ()=>{
		const response = validateAllFields(formState);
        // console.log("isFormInValid()",formState, formInitState, response)
		setErrors({
			...formInitState,
			...response
		})
        return hasAnyError(response);
    }//end function
    const resetErrors = () => {
        setErrors(formInitState);
    }
    return ({
            formState,
            errors,
            setErrors,
            resetErrors,
            handleChange,
            isFormInValid,
            validateField,
            validateAllFields
        })
}
