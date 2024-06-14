import React, { useEffect } from 'react';
import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface ReusableFormSectionProps {
    radioGroupId: string;
    defaultValue: string;
    onLangChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add this prop
  }

const ReusableFormSection: React.FC<ReusableFormSectionProps> = ({ radioGroupId, defaultValue, onLangChange }) => {
  useEffect(() => {
    let langSel = 'English';

    const radioBVal = () => {
      const selectedValue = (document.querySelector(`input[name="${radioGroupId}"]:checked`) as HTMLInputElement)?.value;
      langSel = selectedValue || langSel;
      return langSel;
    };

    const KruToUniC = (evt: KeyboardEvent) => {
      const key = evt.keyCode || evt.charCode;
      if (key === 8 || key === 37 || key === 39 || key === 46) return;

      if (langSel.toLowerCase().indexOf('hi') < 0) return;

      const target = evt.target as HTMLInputElement;
      let v = target.value;
      const v1 = target.selectionStart;
      if (v1 === null) return;
      const Cha = v[v1 - 1];
      if (Cha === ' ') return;

      const res = convert_to_unicode2(Cha);
      const z1 = v.substring(v1);
      v = v.substring(0, v1 - 1) + res + z1;

      target.value = v;
      setSelectionRange(target, v1, v1);
    };

    const setSelectionRange = (element: HTMLInputElement, start: number, end: number) => {
      if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(start, end);
      } else if ((element as any).createTextRange) {
        const range = (element as any).createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
      }
    };

    const convert_to_unicode2 = (text: string): string => {
      const array_one = [
        "aa", "a",
        "ZZ", "Z",
        "=kk", "=k",
        "f=k", "f=",
        "Q+Z", "QZ+",
        "sas", "sa",
        "‘", "\"",
        "’", "\"",
        "“", "'",
        "”", "'",
        "ƒ", "१",
        "„", "२",
        "…", "३",
        "†", "४",
        "‡", "५",
        "ˆ", "६",
        "‰", "७",
        "Š", "८",
        "‹", "९",
        "Œ", "०",
        "å", "०",
        "v‚", "ऑ",
        "vks", "ओ",
        "vkS", "औ",
        "vk", "आ",
        "v", "अ",
        "b±", "ईं",
        "Ã", "ई",
        "bZ", "ई",
        "b", "इ",
        "m", "उ",
        "Å", "ऊ",
        ",s", "ऐ",
        ",", "ए",
        "_", "ऋ",
        "d+", "क़",
        "[+", "ख़्",
        "x+", "ग़",
        "T+", "ज़्",
        "t+", "ज़",
        "M+", "ड़",
        "<+", "ढ़",
        "¶+", "फ़्",
        "Q+", "फ़",
        ";+", "य़",
        "j+", "ऱ",
        "u+", "ऩ",
        "d", "क",
        "D", "क्",
        "£", "ख्र",
        "[", "ख्",
        "x", "ग",
        "X", "ग्",
        "Ä", "घ",
        "?", "घ्",
        "³", "ङ",
        "p", "च",
        "P", "च्",
        "N", "छ",
        "t", "ज",
        "T", "ज्",
        ">", "झ",
        "÷", "झ्",
        "Ö", "झ्",
        "¥", "ञ",
        "V", "ट",
        "B", "ठ",
        "M", "ड",
        "<", "ढ",
        ".", "ण्",
        "r", "त",
        "R", "त्",
        "F", "थ्",
        "n", "द",
        "/", "ध्",
        "Ë", "ध्",
        "è", "ध्",
        "u", "न",
        "U", "न्",
        "i", "प",
        "I", "प्",
        "Q", "फ",
        "¶", "फ्",
        "c", "ब",
        "C", "ब्",
        "Ò", "भ",
        "H", "भ्",
        "e", "म",
        "E", "म्",
        ";", "य",
        "¸", "य्",
        "j", "र",
        "y", "ल",
        "Y", "ल्",
        "G", "ळ",
        "Üo", "श्व",
        "Ük", "श",
        "Üz", "श्र्",
        "o", "व",
        "O", "व्",
        "'", "श्",
        "\"", "ष्",
        "l", "स",
        "L", "स्",
        "g", "ह",
        "Ñ", "कृ",
        "—", "कृ",
        "ô", "क्क",
        "ä", "क्त",
        "{", "क्ष्",
        "K", "ज्ञ",
        "ê", "ट्ट",
        "Í", "ट्ट",
        "ë", "ट्ठ",
        "Î", "ट्ठ",
        "ð", "ठ्ठ",
        "Ï", "ड्ड",
        "ì", "ड्ड",
        "ï", "ड्ढ",
        "Ô", "ड्ढ",
        "Ù", "त्त्",
        "=", "त्र",
        "«", "त्र्",
        "–", "दृ",
        "Ì", "द्द",
        "í", "द्द",
        ")", "द्ध",
        "˜", "द्भ",
        "ö", "द्भ",
        "|", "द्य",
        "}", "द्व",
        "é", "न्न",
        "™", "न्न्",
        "ó", "स्त्र",
        "â", "हृ",
        "à", "ह्न",
        "ã", "ह्म",
        "á", "ह्य",
        "º", "ह्",
        "J", "श्र",
        "Ø", "क्र",
        "Ý", "फ्र",
        "æ", "द्र",
        "ç", "प्र",
        "Á", "प्र",
        "#", "रु",
        ":", "रू",
        "Ó", "्य",
        "î", "्य",
        "z", "्र",
        "ª", "्र",
        "È", "ीं",
        "Ê", "Zी",
        "›", "Zैं",
        "õ", "Zैं",
        "±", "Zं",
        "Æ", "र्f",
        "É", "र्Ç",
        "्k", "",
        "‚", "ॉ",
        "¨", "ो",
        "®", "ो",
        "ks", "ो",
        "©", "ौ",
        "kS", "ौ",
        "h", "ी",
        "q", "ु",
        "w", "ू",
        "`", "ृ",
        "s", "े",
        "¢", "े",
        "S", "ै",
        "a", "ं",
        "¡", "ँ",
        "%", "ः",
        "W", "ॅ",
        "•", "ऽ",
        "·", "ऽ",
        "∙", "ऽ",
        "·", "ऽ",
        "~", "्",
        "+", "़",
        "k", "ा",
        "A", "।",
        "ñ", "॰",
        "\\", "?",
        " ः", " :",
        "^", "‘",
        "*", "’",
        "Þ", "“",
        "ß", "”",
        "(", ";",
        "¼", "(",
        "½", ")",
        "¿", "{",
        "À", "}",
        "¾", "=",
        "-", ".",
        "&", "-",
        "]", ",",
        "@", "/",
        "~ ", "् ",
        "ाे", "ो",
        "ाॅ", "ॉ",
        "े्र", "्रे",
        "अौ", "औ",
        "अो", "ओ",
        "आॅ", "ऑ"
      ];

      for (let i = 0; i < array_one.length - 1; i += 2) {
        text = text.split(array_one[i]).join(array_one[i + 1]);
      }

      text = text.replace(/([fÇ])([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])/g, "$2$1");
      text = text.replace(/([fÇ])(्)([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])/g, "$2$3$1");
      text = text.replace(/([fÇ])(्)([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])/g, "$2$3$1");
      text = text.replace(/f/g, "ि");
      text = text.replace(/Ç/g, "िं");
      text = text.replace(/([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])([ािीुूृेैोौंँ]*)([Z])/g, "$3$1$2");
      text = text.replace(/([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])([्])([Z])/g, "$3$1$2");
      text = text.replace(/([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])([्])([Z])/g, "$3$1$2");
      text = text.replace(/Z/g, "र्");
      text = text.replace(/([ंँ॰])([ािीुूृेैोौ])/g, "$2$1");
      text = text.replace(/([ािीुूृेैोौंँ])([ािीुूृेैोौ])/g, "$1");

      return text;
    };

    document.addEventListener('keydown', KruToUniC as EventListener);
    
    return () => {
      document.removeEventListener('keydown', KruToUniC as EventListener);
    };
  }, [radioGroupId, defaultValue]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Language Selection</FormLabel>
          <RadioGroup row aria-label="language" name={radioGroupId} defaultValue={defaultValue}>
            <FormControlLabel value="English" control={<Radio />} label="English" />
            <FormControlLabel value="Hindi" control={<Radio />} label="Hindi" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ReusableFormSection;
