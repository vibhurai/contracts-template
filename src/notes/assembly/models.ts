import { logging, PersistentVector } from 'near-sdk-as';

@nearBindgen
export class Note {

  public content: string;

  edit(note: string, append: bool = false): void {
    if (append) {
      this.content += (note);
      logging.log("true " + this.content);
    } else {
      this.content = note;
      logging.log("false " + this.content);
    }
  }

  get(): string {
    return this.content;
  }
}

@nearBindgen
export class Vector<T> extends PersistentVector<T>{
  get_one(text: string): Note {
    var n = new Note();

    for (let i = 0; i < this.length; i++) {
      logging.log(this[i].get());
      if (this[i].get() == text) {
        logging.log("here");
        n = this[i];
      }
    }

    return n;
  }

  get_all(): Array<string> {
    const result = new Array<string>();

    for (let i = 0; i < this.length; i++) {
      const entry = this[i].get();
      result.push(entry);
    }
    return result;
  }
}