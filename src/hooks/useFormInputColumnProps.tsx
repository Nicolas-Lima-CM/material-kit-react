import { useEffect } from 'react';

import {
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import {
  normalizeFloatNumberInput,
  normalizeIntegerInput,
  normalizeStringInput,
} from '../utils/formUtils';

interface FormInputColumnCommonProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  getValues?: UseFormGetValues<T>;
  errors: FieldErrors<T>;
  columnClassName?: string;
}

function useFormInputColumnCommonProps<T extends FieldValues>({
  register,
  errors,
  setValue,
  getValues,
  columnClassName,
}: FormInputColumnCommonProps<T>) {
  const formInputColumnCommonProps = {
    register,
    errors,
    columnClassName: columnClassName
      ? columnClassName
      : 'col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-3 mb-lg-0',
  };

  // Handle Field Initialization
  const handleFieldInitialization = (registerName: string, initialValue: string) => {
    useEffect(() => {
      if (getValues) {
        const inputValue = getValues()[registerName];
        if (!inputValue.trim()) {
          setValue(registerName as Path<T>, initialValue as PathValue<T, Path<T>>);
        }
      }
    }, []);
  };

  const getStringInputColumnCommonProps = (registerName: string, maxLength?: number) => {
    return {
      ...formInputColumnCommonProps,
      onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) =>
        setValue(
          registerName as Path<T>,
          normalizeStringInput(event, maxLength) as PathValue<T, Path<T>>
        ),
    };
  };

  const getFloatInputColumnCommonProps = (registerName: string, number1 = 1, number2?: number) => {
    handleFieldInitialization(registerName, '0.00');

    let startsWithZero = false;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let { value: inputValue } = event.target;

      if (inputValue) {
        if (startsWithZero) {
          inputValue = inputValue.slice(1);
        }
        startsWithZero = false;
      }

      inputValue = normalizeFloatNumberInput(event, number1, number2 ? number2 : 1);

      if (!inputValue) {
        // If the current input value is empty, set the value to "0"
        inputValue = '0';
        startsWithZero = true;
      }

      return inputValue as PathValue<T, Path<T>>;
    };

    return {
      ...formInputColumnCommonProps,
      onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) =>
        setValue(registerName as Path<T>, handleChange(event)),
    };
  };

  const getIntegerInputColumnCommonProps = (registerName: string, maxLength?: number) => {
    handleFieldInitialization(registerName, '0');

    return {
      ...formInputColumnCommonProps,
      onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) =>
        setValue(
          registerName as Path<T>,
          normalizeIntegerInput(event, maxLength) as PathValue<T, Path<T>>
        ),
    };
  };

  return {
    formInputColumnCommonProps,
    getFloatInputColumnCommonProps,
    getIntegerInputColumnCommonProps,
    getStringInputColumnCommonProps,
  };
}

export default useFormInputColumnCommonProps;
