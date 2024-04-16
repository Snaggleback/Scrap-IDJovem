import { IDJovem } from "./id-jovem.js";

(async () => {
    const codigosParaValidar = await Promise.all([
        IDJovem.validar({ validador: "12345678901" }),
        IDJovem.validar({ validador: "XXXXXXXXXXX" }),
    ]);
    console.log(codigosParaValidar);
})();
