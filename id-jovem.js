import puppeteer from "puppeteer";

export class IDJovem {
    static async emitir({ nis, nome, mae, nascimento }) {
        // Cria um navegador
        const browser = await puppeteer.launch(),
            // Cria uma nova aba
            page = await browser.newPage();

        // Vai para o site e abre uma nova aba
        await page.goto("https://idjovem.juventude.gov.br/emitir-id-jovem");

        // Preenche o formulário
        await page.type("#numeronis", nis);
        await page.type("#nomecompleto", nome);
        await page.type("#nomemae", mae);
        await page.type("#datepicker", nascimento);

        // Clica no botão para enviar os dados
        await Promise.all([
            // Clica no botão
            page.click(
                "#main > div > section > form > div > div.right-side.right-form > div > div:nth-child(4) > div > button",
            ),
            // Espera o redirecionamento
            page.waitForNavigation(),
        ]);

        // Verifica se o erro ocorreu
        if (page.url().includes("errodados")) {
            // Fecha o navegador
            await browser.close();
            // Retorna o erro
            return {
                error: "Dados inválidos",
            };
        }

        // Tira uma screenshot da tela e salva
        await page.screenshot({
            path: `id-jovem-${new Date().getTime()}.png`,
        });

        // Pega os dados desejados que são a validade e o validador
        const infoDesejada = await page.evaluate(() => {
            return {
                // Validador que verifica se o documento foi emitido
                validador: document.querySelector(
                    "body > div.form-style-9 > div > div:nth-child(3) > span",
                ).innerText,
                // Data de validade do documento
                validade: document.querySelector(
                    "body > div.form-style-9 > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > h4:nth-child(1)",
                ).innerText,
            };
        });

        // Fecha o navegador
        await browser.close();

        // Retorna os dados que foram emitidos
        return {
            nis,
            nome,
            mae: mae,
            nascimento: nascimento,
            ...infoDesejada,
        };
    }

    static async validar({ validador }) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto("https://idjovem.juventude.gov.br/validarcarteira");

        // Preencha o campo do validador
        await page.type(
            "#main > div > section > form > div > div.right-side > input[type=text]",
            validador,
        );

        // Definir o tamanho da página
        await page.setViewport({
            width: 1080,
            height: 1024,
        });

        page.on("dialog", async (dialog) => {
            // console.log(dialog.message());
            await dialog.accept();
        });

        await page.click(
            "#main > div > section > form > div > div.right-side > button",
        );
        await page.waitForNavigation({
            waitUntil: "networkidle2",
        });

        const codigoValidado = await page.evaluate(() => {
            return (
                document.querySelector(
                    "#main > div > section > form > div:nth-child(1) > h1",
                ) !== null
            );
        });

        await page.screenshot({
            path: `id-jovem-validation-${new Date().getTime()}.png`,
        });

        await browser.close();
        return codigoValidado
            ? { validador }
            : { falha: "Validador incorreto" };
    }
}
