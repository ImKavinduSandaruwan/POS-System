package com.kavindu.pos.controller;

import com.kavindu.pos.model.Category;
import com.kavindu.pos.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/categories")
    public List<Category> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable int id){
        Category category = categoryService.getCategoryById(id);
        if(category != null){
            return new ResponseEntity<>(category, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/categories")
    public void createCategory(@RequestBody Category category){
        categoryService.createCategory(category);
    }

    @PutMapping("/categories/{id}")
    public void updateCategory(@PathVariable int id, @RequestBody Category category){
        category.setCategoryId(id);
        categoryService.updateCategory(category);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable int id){
        categoryService.deleteCategory(id);
    }
}
