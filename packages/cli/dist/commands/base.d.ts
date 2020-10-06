import * as yargs from 'yargs';
export interface BaseCommand {
    setOptions(yargs: yargs.Argv): void;
    execute(argv: any): void;
}
