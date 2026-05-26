package com.example.services

import com.vaadin.flow.server.auth.AnonymousAllowed
import com.vaadin.hilla.BrowserCallable
import com.example.models.MediaRule
import org.springframework.stereotype.Service

@BrowserCallable
@AnonymousAllowed
@Service
class RuleService {
    fun saveRule(rule: MediaRule): MediaRule {
        // Save to SQLite...
        return rule
    }
}
