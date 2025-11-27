// src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

// هذا الخطاف يأخذ قيمة (مثل نص البحث) ومدة تأخير
function useDebounce(value, delay) {
  // حالة لتخزين القيمة "المؤجلة"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // إعداد مؤقت (timer) سيقوم بتحديث القيمة بعد انتهاء مدة التأخير
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // دالة التنظيف: هذه الدالة يتم استدعاؤها في كل مرة تتغير فيها "value"
    // وظيفتها هي إلغاء المؤقت القديم قبل إعداد مؤقت جديد
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // إعادة تشغيل التأثير فقط إذا تغيرت القيمة أو مدة التأخير

  return debouncedValue;
}

export default useDebounce;
