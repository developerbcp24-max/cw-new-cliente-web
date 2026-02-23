export class SaveFavorite {
    isFavorite!: boolean;
    name!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
