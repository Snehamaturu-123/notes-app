package com.example.notesapp.repository;

import com.example.notesapp.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NoteRepository extends MongoRepository<Note, String> {}
