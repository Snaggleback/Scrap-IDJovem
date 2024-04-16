import { IDJovem } from "./id-jovem.js";

IDJovem.emitir({
    nis: "00000000000",
    nome: "SEU NOME COMPLETO",
    mae: "NOME DA SUA MÃE (COMPLETO)",
    nascimento: "31/12/1999",
}).then((card) => console.log(card));

IDJovem.validar({
    validador: "XXXXXXXXXX",
}).then((valid) => console.log(valid));
