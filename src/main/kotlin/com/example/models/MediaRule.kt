package com.example.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
data class MediaRule(
    @field:NotBlank(message = "Rule name cannot be empty")
    @field:Size(min = 3, message = "Name must be at least 3 characters")
    var name: String = "",

    var targetDirectory: String = "",

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
)
