buildscript {
	repositories { mavenCentral() }
	dependencies {
		classpath("org.flywaydb:flyway-database-postgresql:12.6.2")
		classpath("org.postgresql:postgresql:42.7.10")
	}
}

plugins {
	kotlin("jvm") version "2.2.21"
	kotlin("plugin.spring") version "2.2.21"
	kotlin("plugin.jpa") version "2.2.21"
	id("org.springframework.boot") version "4.0.6"
	id("io.spring.dependency-management") version "1.1.7"
	id("com.vaadin") version "25.1.6"
	id("org.flywaydb.flyway") version "12.6.2"
}

flyway {
	url = "jdbc:postgresql://localhost:5432/hilla_tailwind_dev"
	user = "postgres"
	password = "postgres"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

extra["vaadinVersion"] = "25.1.6"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	developmentOnly("com.vaadin:vaadin-dev")
	implementation("com.vaadin:vaadin-spring-boot-starter")
	implementation("com.vaadin:hilla-spring-boot-starter")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("tools.jackson.module:jackson-module-kotlin")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-flyway")
	implementation("org.flywaydb:flyway-database-postgresql")
	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

dependencyManagement {
	imports {
		mavenBom("com.vaadin:vaadin-bom:${property("vaadinVersion")}")
	}
}

vaadin {
	javaSourceFolder = file("src/main/kotlin")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
