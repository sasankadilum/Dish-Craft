package com.dishcraft.repository;

import com.dishcraft.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {

    List<Recipe> findByTitleContainingIgnoreCase(String title);

    List<Recipe> findByUserId(String userId);

    // මේ method එක අනිවාර්යයෙන්ම අවශ්‍යයි "Top Chefs" logic එක වැඩ කරන්න
    long countByUserId(String userId);
}