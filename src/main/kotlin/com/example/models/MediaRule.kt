package com.example.models

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class MediaRule(
    @field:NotBlank(message = "Rule name cannot be empty")
    @field:Size(min = 3, message = "Name must be at least 3 characters")
    var name: String = "",
    
    var targetDirectory: String = ""
)
