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
    fun saveRule(rule: MediaRule): MediaRule {
        return ruleRepository.save(rule)
    }
}
