package com.example

import com.example.models.MediaRule
import com.example.repositories.MediaRuleRepository
import com.example.services.RuleService
import org.junit.jupiter.api.Assertions.*
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
    fun `saveRule inserts a new record`() {
        val before = ruleRepository.count()
        ruleService.saveRule(MediaRule(name = "Movies Rule", targetDirectory = "/mnt/nas/movies"))
        assertEquals(before + 1, ruleRepository.count())
        val saved = ruleRepository.findAll().last()
        assertEquals("Movies Rule", saved.name)
        assertEquals("/mnt/nas/movies", saved.targetDirectory)
    }

    @Test
    fun `saveRule assigns an id to a new record`() {
        val rule = MediaRule(name = "Has ID", targetDirectory = "/has-id")
        assertNull(rule.id)
        val saved = ruleService.saveRule(rule)
        assertNotNull(saved.id)
    }

    @Test
    fun `getRules returns all saved rules`() {
        ruleService.saveRule(MediaRule(name = "Rule One", targetDirectory = "/one"))
        ruleService.saveRule(MediaRule(name = "Rule Two", targetDirectory = "/two"))

        val rules = ruleService.getRules()

        assertTrue(rules.any { it.name == "Rule One" && it.targetDirectory == "/one" })
        assertTrue(rules.any { it.name == "Rule Two" && it.targetDirectory == "/two" })
    }

    @Test
    fun `saveRule with existing id updates the record in place`() {
        val saved = ruleService.saveRule(MediaRule(name = "Original", targetDirectory = "/orig"))
        assertNotNull(saved.id)

        val updated = ruleService.saveRule(saved.copy(name = "Updated", targetDirectory = "/upd"))

        assertEquals(saved.id, updated.id)
        assertEquals("Updated", updated.name)
        assertEquals("/upd", updated.targetDirectory)
        assertEquals(1, ruleRepository.findAll().count { it.id == saved.id })
    }

    @Test
    fun `deleteRule removes the record`() {
        val saved = ruleService.saveRule(MediaRule(name = "To Delete", targetDirectory = "/del"))
        val id = saved.id!!
        assertTrue(ruleRepository.existsById(id))

        ruleService.deleteRule(id)

        assertFalse(ruleRepository.existsById(id))
    }
}
