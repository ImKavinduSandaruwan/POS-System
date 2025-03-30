package com.kavindu.pos.service;

import com.kavindu.pos.model.Category;
import com.kavindu.pos.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    CategoryRepo categoryRepo;

    public List<Category> getAllCategories(){
        return categoryRepo.findAll();
    }

    public Category getCategoryById(int id){
        return categoryRepo.findById(id).orElse(null);
    }

    public void createCategory(Category category){
        categoryRepo.save(category);
    }

    public void updateCategory(Category category){
        categoryRepo.save(category);
    }

    public void deleteCategory(int id){
        categoryRepo.deleteById(id);
    }
}
