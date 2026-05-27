package com.example.services

import com.vaadin.flow.server.auth.AnonymousAllowed
import com.vaadin.hilla.BrowserCallable
import com.example.models.MediaRule
import com.example.repositories.MediaRuleRepository
import org.springframework.stereotype.Service

@BrowserCallable
@AnonymousAllowed
@Service
class RuleService(private val ruleRepository: MediaRuleRepository) {
    fun getRules(): List<MediaRule> = ruleRepository.findAll()

    fun saveRule(rule: MediaRule): MediaRule = ruleRepository.save(rule)

    fun deleteRule(id: Long) = ruleRepository.deleteById(id)
}
