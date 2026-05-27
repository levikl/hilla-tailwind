package com.example

import com.example.models.MediaRule
import com.example.repositories.MediaRuleRepository
import com.example.services.RuleService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class RuleServiceUnitTest {

    @Mock
    lateinit var ruleRepository: MediaRuleRepository

    @InjectMocks
    lateinit var ruleService: RuleService

    @Test
    fun `getRules delegates to repository findAll`() {
        val rules = listOf(MediaRule(name = "Rule A", targetDirectory = "/a", id = 1L))
        `when`(ruleRepository.findAll()).thenReturn(rules)

        val result = ruleService.getRules()

        assertEquals(rules, result)
        verify(ruleRepository).findAll()
    }

    @Test
    fun `saveRule delegates to repository save and returns saved entity`() {
        val rule = MediaRule(name = "Rule B", targetDirectory = "/b")
        val saved = rule.copy(id = 2L)
        `when`(ruleRepository.save(rule)).thenReturn(saved)

        val result = ruleService.saveRule(rule)

        assertEquals(saved, result)
        verify(ruleRepository).save(rule)
    }

    @Test
    fun `deleteRule delegates to repository deleteById`() {
        ruleService.deleteRule(42L)
        verify(ruleRepository).deleteById(42L)
    }
}
