import { useEffect, useState } from "react";
import Fingerprint2 from "fingerprintjs2";

// Asynchronous function to get the fingerprint
const getFingerprint = async () => {
  try {
    const options = {
      excludes: {
        plugins: true,
        localStorage: true,
        adBlock: true,
      },
    };

    const components = await Fingerprint2.getPromise(options);
    const values = components.map(
      (component: { value: unknown }) => component.value
    );
    return String(Fingerprint2.x64hash128(values.join(""), 31));
  } catch (error) {
    return null;
  }
};

// Custom hook to use the fingerprint
const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    getFingerprint().then((fingerprint) => {
      setFingerprint(fingerprint);
    });
  }, []);

  return fingerprint;
};

export default useFingerprint;
