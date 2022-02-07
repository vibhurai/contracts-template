import { Note } from './modules'
import { logging, PersistentVector, PersistentSet } from 'near-sdk-as';

@nearBindgen
export class Vector<T> extends PersistentVector<T>{
    get_one(text: string): Note {
        var n = new Note();

        for (let i = 0; i < this.length; i++) {
            logging.log(this[i].get_content());
            if (this[i].get_content().includes(text)) {
                logging.log("here");
                n = this[i];
                break;
            }
        }

        return n;
    }

    get_all(): Array<T> {
        const result = new Array<T>();

        for (let i = 0; i < this.length; i++) {
            const entry = this[i];
            result.push(entry);
        }
        return result;
    }
}

@nearBindgen
export class Set<T> extends PersistentSet<T>{ }

