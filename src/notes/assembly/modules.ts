import { logging, PersistentVector } from 'near-sdk-as';

@nearBindgen
export class Note {

  public id: number;
  public content: string;

  edit(note: string, id: number, append: bool = false): void {
    if (append) {
      this.content += (note);
      logging.log("true " + this.content);
    } else {
      this.content = note;

      // New ID has been passed
      if (id > -1)
        this.id = id;

      logging.log("false " + this.content);
    }
  }

  get_content(): string {
    return this.content;
  }
}
