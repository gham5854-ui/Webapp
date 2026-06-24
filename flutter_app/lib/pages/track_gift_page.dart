import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/shipments_provider.dart';
import 'delay_dash_screen.dart';
import 'login_page.dart';
import 'main_navigation_page.dart';
import 'shipment_detail_page.dart';

class TrackGiftPage extends StatefulWidget {
  const TrackGiftPage({super.key});

  @override
  State<TrackGiftPage> createState() => _TrackGiftPageState();
}

class _TrackGiftPageState extends State<TrackGiftPage> {
  final _pinController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String? _localError;

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  void _track() async {
    setState(() {
      _localError = null;
    });

    if (!_formKey.currentState!.validate()) return;

    final pin = _pinController.text.trim();
    final provider = Provider.of<ShipmentsProvider>(context, listen: false);

    final shipment = await provider.trackShipment(pin);

    if (shipment != null) {
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => DelayDashScreen(
              nextScreen: ShipmentDetailPage(shipment: shipment),
              message: 'Locating package status and transit timeline...',
            ),
          ),
        );
      }
    } else {
      setState(() {
        _localError = provider.errorMessage ?? 'No shipment found with this tracking PIN';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final shipmentsProvider = Provider.of<ShipmentsProvider>(context);

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFFBE185D), // gift-700
              Color(0xFFEC4899), // gift-500
              Color(0xFF4F46E5), // pin-600
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo/Brand
                  Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.2),
                        ),
                      ),
                      child: const Icon(
                        Icons.card_giftcard_rounded,
                        color: Colors.white,
                        size: 40,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'GiftPin',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Real-time Emotional Gift Tracking',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.75),
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 36),

                  // Input Box Card
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text(
                            'Track a Surprise Gift',
                            style: GoogleFonts.outfit(
                              textStyle: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Enter your unique 8-digit Gift PIN to see its current processing or delivery transit timeline.',
                            style: TextStyle(fontSize: 11, color: Colors.black45, height: 1.4),
                          ),
                          const SizedBox(height: 20),

                          // Text field
                          TextFormField(
                            controller: _pinController,
                            textAlign: TextAlign.center,
                            textCapitalization: TextCapitalization.characters,
                            style: GoogleFonts.outfit(
                              textStyle: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFEC4899),
                                letterSpacing: 2,
                              ),
                            ),
                            decoration: InputDecoration(
                              hintText: 'GP-XXXX-XXXX',
                              hintStyle: TextStyle(
                                fontSize: 18,
                                color: Colors.grey.shade300,
                                letterSpacing: 2,
                              ),
                              contentPadding: const EdgeInsets.symmetric(vertical: 14),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: BorderSide(color: Colors.grey.shade200),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: BorderSide(color: Colors.grey.shade200),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: const BorderSide(color: Color(0xFFEC4899), width: 2),
                              ),
                            ),
                            validator: (val) {
                              if (val == null || val.trim().isEmpty) {
                                return 'Please enter a tracking PIN';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          // Error alert
                          if (_localError != null)
                            Container(
                              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                              decoration: BoxDecoration(
                                color: Colors.red.shade50,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: Colors.red.shade100),
                              ),
                              child: Text(
                                _localError!,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: Colors.red.shade700,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),

                          if (_localError != null) const SizedBox(height: 16),

                          // Submit Button
                          ElevatedButton(
                            onPressed: shipmentsProvider.isLoading ? null : _track,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEC4899),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: shipmentsProvider.isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : Text(
                                    'Track Shipment 📦',
                                    style: GoogleFonts.outfit(
                                      textStyle: const TextStyle(fontWeight: FontWeight.bold),
                                    ),
                                  ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Sender Navigation Link
                  if (authProvider.isAuthenticated)
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const DelayDashScreen(
                              nextScreen: MainNavigationPage(),
                              message: 'Loading sender profile dashboard...',
                            ),
                          ),
                        );
                      },
                      icon: const Icon(Icons.dashboard_rounded, size: 16),
                      label: const Text('Go to My Sender Dashboard'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.15),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: Colors.white.withOpacity(0.2)),
                        ),
                      ),
                    )
                  else
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const DelayDashScreen(
                              nextScreen: LoginPage(),
                              message: 'Navigating to authentication console...',
                            ),
                          ),
                        );
                      },
                      icon: const Icon(Icons.login_rounded, size: 16),
                      label: const Text('Sender Sign In / Register'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.15),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: Colors.white.withOpacity(0.2)),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
