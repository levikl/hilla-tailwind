package com.example

import com.example.models.MediaRule
import com.example.repositories.MediaRuleRepository
import com.example.services.RuleService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RuleEditorIntegrationTest {

    @Autowired
    lateinit var ruleService: RuleService

    @Autowired
    lateinit var ruleRepository: MediaRuleRepository

    @Test
    fun `submitting RuleEditor form saves record to database`() {
        val before = ruleRepository.count()

        ruleService.saveRule(MediaRule(name = "Movies Rule", targetDirectory = "/mnt/nas/movies"))

        assertEquals(before + 1, ruleRepository.count())
        val saved = ruleRepository.findAll().last()
        assertEquals("Movies Rule", saved.name)
        assertEquals("/mnt/nas/movies", saved.targetDirectory)
    }
}
