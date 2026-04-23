import { useState, useCallback, useEffect, useRef } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    console.log("Changed", field, value);

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  }, []);

  const reset = useCallback(
    (newValues?: T) => {
      setValues(newValues ?? initialValues);
      setErrors({});
    },
    [initialValues],
  );
  const valuesRef = useRef(values);
  const onSubmitRef = useRef(onSubmit);
  const validateRef = useRef(validate);

  // Sync semua ref ke nilai terbaru setiap render
  useEffect(() => {
    valuesRef.current = values;
    onSubmitRef.current = onSubmit;
    validateRef.current = validate;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e?.preventDefault();
    // if (validate) {
    //   const validationErrors = validate(values);
    //   if (Object.keys(validationErrors).length > 0) {
    //     setErrors(validationErrors);
    //     return;
    //   }
    // }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
  };
}
