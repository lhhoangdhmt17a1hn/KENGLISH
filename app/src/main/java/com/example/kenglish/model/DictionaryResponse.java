package com.example.kenglish.model;

import java.util.List;

public class DictionaryResponse {

    private boolean success;
    private String word;
    private String language;
    private String ipa;
    private String audio;
    private List<Meaning> meanings;

    public boolean isSuccess() {
        return success;
    }

    public String getWord() {
        return word;
    }

    public String getLanguage() {
        return language;
    }

    public String getIpa() {
        return ipa;
    }

    public String getAudio() {
        return audio;
    }

    public List<Meaning> getMeanings() {
        return meanings;
    }
}