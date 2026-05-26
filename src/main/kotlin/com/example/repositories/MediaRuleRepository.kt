package com.example.repositories

import com.example.models.MediaRule
import org.springframework.data.jpa.repository.JpaRepository

interface MediaRuleRepository : JpaRepository<MediaRule, Long>
