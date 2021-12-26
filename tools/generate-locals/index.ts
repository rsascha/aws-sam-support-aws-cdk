import { readFile, writeFile } from "jsonfile";

const cdkOutputsFile = "cdk-outputs.json";
const localsFile = "locals.json";

interface CdkDayStackType {
    APIurl: string;
    GetFunctionName: string;
    TranslationTable: string;
    SaveFunctionName: string;
    PutFunctionName: string;
    TranslationBus: string;
}

interface CdkOutputsType {
    CdkDayStack: CdkDayStackType;
}

readFile(cdkOutputsFile)
    .catch((error) => {
        console.info(`Input file  not found: '${cdkOutputsFile}'!`);
        console.info("Maybe you need to execute `npm run deploy`?");
        console.error(error);
        process.exit(1);
    })
    .then((data: CdkOutputsType) => {
        const locals = {
            "CdkDayStack/GetTranslationFunction": {
                TRANSLATE_TABLE: data.CdkDayStack.TranslationTable,
            },
            "CdkDayStack/SaveTranslationFunction": {
                TRANSLATE_TABLE: data.CdkDayStack.TranslationTable,
            },
            "CdkDayStack/PutTranslationFunction": {
                TRANSLATE_BUS: data.CdkDayStack.TranslationBus,
            },
        };
        writeFile(localsFile, locals)
            .catch((error) => {
                console.error(error);
                process.exit(1);
            })
            .then(() => {
                console.log(`Wrote file: '${localsFile}'`);
            });
    });
