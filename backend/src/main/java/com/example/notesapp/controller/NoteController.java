package com.example.notesapp.controller;

import com.example.notesapp.model.Note;
import com.example.notesapp.repository.NoteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin
public class NoteController {

    private final NoteRepository noteRepository;

    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public List<Note> getAllNotes() { return noteRepository.findAll(); }

    @PostMapping
    public Note addNote(@RequestBody Note note) { return noteRepository.save(note); }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable String id, @RequestBody Note note) {
        note.setId(id);
        return noteRepository.save(note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable String id) { noteRepository.deleteById(id); }
}
