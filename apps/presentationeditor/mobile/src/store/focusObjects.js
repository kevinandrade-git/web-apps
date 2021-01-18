import {action, observable, computed} from 'mobx';

export class storeFocusObjects {
    @observable _focusObjects = [];

    @action resetFocusObjects(objects) {
        this._focusObjects = objects;
    }

    @computed get settings() {
        const _settings = [];
        let no_text = true;
        for (let object of this._focusObjects) {
            const type = object.get_ObjectType(),
                objectValue = object.get_ObjectValue();
            if (Asc.c_oAscTypeSelectElement.Paragraph == type) {
                if ( !objectValue.get_Locked() )
                    no_text = false;
            } else if (Asc.c_oAscTypeSelectElement.Table == type) {
                if ( !objectValue.get_Locked() ) {
                    _settings.push('table');
                    no_text = false;
                }
            } else if (Asc.c_oAscTypeSelectElement.Slide == type) {
                if ( !(objectValue.get_LockLayout() || objectValue.get_LockBackground() || objectValue.get_LockTransition() || objectValue.get_LockTiming() ))
                    _settings.push('slide');
            } else if (Asc.c_oAscTypeSelectElement.Image == type) {
                if ( !objectValue.get_Locked() )
                    _settings.push('image');
            } else if (Asc.c_oAscTypeSelectElement.Chart == type) {
                if ( !objectValue.get_Locked() )
                    _settings.push('chart');
            } else if (Asc.c_oAscTypeSelectElement.Shape == type && !objectValue.get_FromChart()) {
                if ( !objectValue.get_Locked() ) {
                    _settings.push('shape');
                    no_text = false;
                }
            } else if (Asc.c_oAscTypeSelectElement.Hyperlink == type) {
                _settings.push('hyperlink');
            }
        }
        if (!no_text && _settings.indexOf('image') < 0)
            _settings.unshift('text');
        const resultArr = _settings.filter((value, index, self) => self.indexOf(value) === index); //get uniq array
        // Exclude hyperlink if text is locked
        if (resultArr.indexOf('hyperlink') > -1 && resultArr.indexOf('text') < 0) {
            resultArr.splice(resultArr.indexOf('hyperlink'), 1);
        }
        // Exclude shapes if chart exist
        if (resultArr.indexOf('chart') > -1) {
            resultArr.splice(resultArr.indexOf('shape'), 1);
        }
        return resultArr;
    }

    @computed get slideObject() {
        const slides = [];
        for (let object of this._focusObjects) {
            if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Slide) {
                slides.push(object);
            }
        }
        if (slides.length > 0) {
            const object = slides[slides.length - 1]; // get top
            return object.get_ObjectValue();
        } else {
            return undefined;
        }
    }
}