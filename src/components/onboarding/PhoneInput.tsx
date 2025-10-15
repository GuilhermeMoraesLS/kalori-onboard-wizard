import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneInputProps {
  value?: { countryCode: string; number: string; name?: string };
  onChange: (phone: { countryCode: string; number: string; name?: string }) => void;
}

const countries = [
  { code: "+55", name: "Brasil", flag: "🇧🇷" },
  { code: "+1", name: "EUA/Canadá", flag: "🇺🇸" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+34", name: "Espanha", flag: "🇪🇸" },
  { code: "+44", name: "Reino Unido", flag: "🇬🇧" },
  { code: "+49", name: "Alemanha", flag: "🇩🇪" },
  { code: "+33", name: "França", flag: "🇫🇷" },
  { code: "+39", name: "Itália", flag: "🇮🇹" },
  { code: "+52", name: "México", flag: "🇲🇽" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
];

// DDDs válidos do Brasil
const validDDDs = [
  "11", "12", "13", "14", "15", "16", "17", "18", "19", // SP
  "21", "22", "24", // RJ
  "27", "28", // ES
  "31", "32", "33", "34", "35", "37", "38", // MG
  "41", "42", "43", "44", "45", "46", // PR
  "47", "48", "49", // SC
  "51", "53", "54", "55", // RS
  "61", // DF
  "62", "64", // GO
  "63", // TO
  "65", "66", // MT
  "67", // MS
  "68", // AC
  "69", // RO
  "71", "73", "74", "75", "77", // BA
  "79", // SE
  "81", "87", // PE
  "82", // AL
  "83", // PB
  "84", // RN
  "85", "88", // CE
  "86", "89", // PI
  "91", "93", "94", // PA
  "92", "97", // AM
  "95", // RR
  "96", // AP
  "98", "99", // MA
];

export const PhoneInput = ({ value, onChange }: PhoneInputProps) => {
  const [countryCode, setCountryCode] = useState(value?.countryCode || "+55");
  const [ddd, setDdd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState(value?.name || "");
  const [error, setError] = useState("");

  // Inicializar campos se houver value
  useEffect(() => {
    if (value?.number && countryCode === "+55") {
      // Extrair DDD e número do formato 5531999614643
      const fullNumber = value.number;
      if (fullNumber.length === 13) { // 55 + 2 dígitos DDD + 9 dígitos
        const extractedDdd = fullNumber.slice(2, 4);
        const extractedNumber = fullNumber.slice(4);
        setDdd(extractedDdd);
        setPhoneNumber(extractedNumber);
      }
    }
  }, [value]);

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    setDdd("");
    setPhoneNumber("");
    setError("");
    onChange({ countryCode: code, number: "", name });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    // Atualizar com o telefone atual
    const currentNumber = countryCode === "+55" && ddd.length === 2 && phoneNumber.length === 9
      ? countryCode.replace("+", "") + ddd + phoneNumber
      : "";
    
    onChange({ countryCode, number: currentNumber, name: newName });
  };

  const handleDddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 2);
    setDdd(input);
    
    if (input.length === 2) {
      if (!validDDDs.includes(input)) {
        setError(`DDD ${input} não existe no Brasil`);
      } else {
        setError("");
      }
    } else {
      setError("");
    }
    
    updatePhone(input, phoneNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    
    if (countryCode === "+55") {
      // Adicionar 9 automaticamente se não começar com 9
      if (input.length > 0 && input[0] !== "9") {
        input = "9" + input;
      }
      
      // Limitar a 9 dígitos (9 + 8 dígitos)
      input = input.slice(0, 9);
    } else {
      input = input.slice(0, 15);
    }
    
    setPhoneNumber(input);
    updatePhone(ddd, input);
  };

  const updatePhone = (currentDdd: string, currentNumber: string) => {
    if (countryCode === "+55") {
      // Validação Brasil
      if (currentDdd.length === 2 && !validDDDs.includes(currentDdd)) {
        setError(`DDD ${currentDdd} inválido`);
        onChange({ countryCode, number: "", name });
        return;
      }
      
      if (currentDdd.length < 2) {
        if (currentNumber.length > 0) {
          setError("Complete o DDD primeiro");
        }
        onChange({ countryCode, number: "", name });
        return;
      }
      
      if (currentNumber.length === 9 && currentNumber[0] === "9") {
        setError("");
        const fullNumber = countryCode.replace("+", "") + currentDdd + currentNumber;
        onChange({ countryCode, number: fullNumber, name });
      } else if (currentNumber.length > 0 && currentNumber.length < 9) {
        setError(`Faltam ${9 - currentNumber.length} dígito(s) no número`);
        onChange({ countryCode, number: "", name });
      } else {
        setError("");
        onChange({ countryCode, number: "", name });
      }
    } else {
      // Validação outros países
      if (currentNumber.length >= 8) {
        setError("");
        const fullNumber = countryCode.replace("+", "") + currentNumber;
        onChange({ countryCode, number: fullNumber, name });
      } else if (currentNumber.length > 0) {
        setError(`Mínimo 8 dígitos (você digitou ${currentNumber.length})`);
        onChange({ countryCode, number: "", name });
      }
    }
  };

  const formatPhoneDisplay = () => {
    if (countryCode === "+55" && ddd.length === 2 && phoneNumber.length === 9) {
      return `(${ddd}) ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
    }
    return "";
  };

  const isValid = () => {
    if (countryCode === "+55") {
      return ddd.length === 2 && validDDDs.includes(ddd) && phoneNumber.length === 9 && phoneNumber[0] === "9";
    }
    return phoneNumber.length >= 8;
  };

  return (
    <div className="space-y-4">
      {/* Destaque do formato */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">�</span>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">
              Seus dados de contato
            </h4>
            <div className="text-xs text-muted-foreground space-y-1 mt-2">
              <p>• Informe seu nome completo</p>
              <p>• Selecione seu país</p>
              {countryCode === "+55" && <p>• Digite DDD + número (o 9 será adicionado automaticamente)</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Campo Nome */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          1. Nome Completo <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={handleNameChange}
          className="h-12 text-base"
          maxLength={100}
        />
        {name && name.length < 3 && (
          <p className="text-xs text-amber-600">Nome deve ter pelo menos 3 caracteres</p>
        )}
      </div>

      {/* Campo País */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          2. País <span className="text-red-500">*</span>
        </label>
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-semibold">{country.code}</span>
                  <span className="text-muted-foreground">- {country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campo DDD (apenas para Brasil) */}
      {countryCode === "+55" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            3. DDD <span className="text-red-500">*</span>
            <span className="text-xs text-muted-foreground font-normal ml-2">
              (ex: 11, 21, 31, 47...)
            </span>
          </label>
          <Input
            type="tel"
            placeholder="11"
            value={ddd}
            onChange={handleDddChange}
            className={`h-12 text-lg text-center font-bold ${
              ddd.length === 2 && validDDDs.includes(ddd)
                ? "border-green-500"
                : ddd.length > 0
                ? "border-amber-500"
                : ""
            }`}
            maxLength={2}
          />
          {ddd.length === 2 && validDDDs.includes(ddd) && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span>✓</span>
              <span>DDD válido</span>
            </div>
          )}
        </div>
      )}

      {/* Campo Número */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {countryCode === "+55" ? "4. Número" : "3. Número"} <span className="text-red-500">*</span>
          {countryCode === "+55" && (
            <span className="text-xs text-muted-foreground font-normal ml-2">
              (adicione o 9 necessário)
            </span>
          )}
        </label>
        <Input
          type="tel"
          placeholder={countryCode === "+55" ? "987654321" : "Digite o número"}
          value={phoneNumber}
          onChange={handleNumberChange}
          disabled={countryCode === "+55" && ddd.length < 2}
          className={`h-12 text-lg ${
            isValid()
              ? "border-green-500"
              : phoneNumber.length > 0
              ? "border-amber-500"
              : ""
          }`}
          maxLength={countryCode === "+55" ? 9 : 15}
        />
        
        {/* Preview do número formatado */}
        {formatPhoneDisplay() && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="text-sm font-medium text-muted-foreground">Número completo:</span>
            <div className="flex flex-col items-end">
              <span className="text-base font-mono font-bold text-foreground">
                {countryCode} {formatPhoneDisplay()}
              </span>

            </div>
          </div>
        )}
        
        {/* Contador de dígitos */}
        {countryCode === "+55" && phoneNumber.length > 0 && phoneNumber.length < 9 && (
          <div className="text-xs text-center text-muted-foreground">
            {phoneNumber.length}/9 dígitos • Faltam {9 - phoneNumber.length}
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Validação visual */}
      {isValid() && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
          <span className="text-green-600 text-xl">✓</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Número válido e pronto para uso!
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
              {countryCode.replace("+", "")}{ddd}{phoneNumber}
            </p>
          </div>
        </div>
      )}

      {/* Dica extra para Brasil */}
      {countryCode === "+55" && !ddd && (
        <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="flex items-start gap-2">
            <span>💡</span>
            <span>
              <strong>Exemplo:</strong> Se seu número é <strong>(11) 98765-4321</strong>, 
              digite DDD = <strong>11</strong> e Número = <strong>987654321</strong> (sem o 9, ele será adicionado automaticamente)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
