# Test Production Backend API Endpoints
# This script tests all critical API endpoints used by the frontend

$baseUrl = "https://ludmil.pythonanywhere.com"
$frontendUrl = "http://localhost:3000"

Write-Host "`n=== Testing Production Backend API ===" -ForegroundColor Cyan
Write-Host "Backend URL: $baseUrl`n" -ForegroundColor Yellow

$tests = @()

# Test 1: my_info endpoint
Write-Host "1. Testing /my_info/ endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/my_info/" -Method GET -Headers @{"Accept"="application/json"} -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    $tests += @{
        Name = "my_info endpoint"
        Status = "PASS"
        Details = "Status: $($response.StatusCode) | Competences: $($json.competences.Count) | Projects: $($json.projects.Count) | Experiences: $($json.experiences.Count)"
    }
    Write-Host "   ✓ PASSED" -ForegroundColor Green
} catch {
    $tests += @{
        Name = "my_info endpoint"
        Status = "FAIL"
        Details = $_.Exception.Message
    }
    Write-Host "   ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Testimonials endpoint
Write-Host "`n2. Testing /testimonials/ endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/testimonials/" -Method GET -Headers @{"Accept"="application/json"} -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    $count = if ($json.Count) { $json.Count } else { if ($json.results) { $json.results.Count } else { 0 } }
    $tests += @{
        Name = "testimonials endpoint"
        Status = "PASS"
        Details = "Status: $($response.StatusCode) | Count: $count"
    }
    Write-Host "   ✓ PASSED" -ForegroundColor Green
} catch {
    $tests += @{
        Name = "testimonials endpoint"
        Status = "FAIL"
        Details = $_.Exception.Message
    }
    Write-Host "   ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: API proxy endpoint (via frontend)
Write-Host "`n3. Testing Frontend API Proxy (/api/graphql)..." -ForegroundColor Green
try {
    $body = @{
        type = "projects"
        data = @{}
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$frontendUrl/api/graphql" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    $tests += @{
        Name = "Frontend API Proxy"
        Status = "PASS"
        Details = "Status: $($response.StatusCode) | Success: $($json.success)"
    }
    Write-Host "   ✓ PASSED" -ForegroundColor Green
} catch {
    $tests += @{
        Name = "Frontend API Proxy"
        Status = "FAIL"
        Details = $_.Exception.Message
    }
    Write-Host "   ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: CORS headers
Write-Host "`n4. Testing CORS configuration..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/my_info/" -Method OPTIONS -Headers @{"Origin"="https://www.ludmilpaulo.co.za"} -ErrorAction Stop
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        $tests += @{
            Name = "CORS Configuration"
            Status = "PASS"
            Details = "CORS header present: $corsHeader"
        }
        Write-Host "   ✓ PASSED" -ForegroundColor Green
    } else {
        $tests += @{
            Name = "CORS Configuration"
            Status = "WARN"
            Details = "CORS header not found in OPTIONS response"
        }
        Write-Host "   ⚠ WARNING: CORS header not found" -ForegroundColor Yellow
    }
} catch {
    $tests += @{
        Name = "CORS Configuration"
        Status = "WARN"
        Details = "Could not test CORS: $($_.Exception.Message)"
    }
    Write-Host "   ⚠ WARNING: Could not test CORS" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
$passed = ($tests | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($tests | Where-Object { $_.Status -eq "FAIL" }).Count
$warned = ($tests | Where-Object { $_.Status -eq "WARN" }).Count

Write-Host "Total Tests: $($tests.Count)" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Warnings: $warned" -ForegroundColor Yellow

Write-Host "`nDetailed Results:" -ForegroundColor Cyan
foreach ($test in $tests) {
    $color = switch ($test.Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        default { "Yellow" }
    }
    Write-Host "  [$($test.Status)] $($test.Name): $($test.Details)" -ForegroundColor $color
}

if ($failed -eq 0) {
    Write-Host "`n✓ All critical tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n✗ Some tests failed. Please review the errors above." -ForegroundColor Red
}
