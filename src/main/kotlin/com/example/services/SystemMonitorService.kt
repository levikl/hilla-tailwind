package com.example.services

import com.vaadin.flow.server.auth.AnonymousAllowed
import com.vaadin.hilla.BrowserCallable
import org.springframework.stereotype.Service

@BrowserCallable
@AnonymousAllowed // Bypasses Spring Security for this endpoint
@Service
class SystemMonitorService {
    // Hilla turns this into a TypeScript function returning a Promise<string>
    fun getStatus(): String = "System is Nominal. Kotlin is running."
}
